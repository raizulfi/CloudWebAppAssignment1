"use client";

import { useState, useEffect } from 'react';
import { Tab, TabsState } from '../types/tab';
import { loadTabsFromStorage, saveTabsToStorage, generateTabId } from '../utils/storage';

export default function Home() {
	const [tabsState, setTabsState] = useState<TabsState>({ tabs: [], activeTabId: null });
	const [editingTab, setEditingTab] = useState<string | null>(null);
	const [generatedCode, setGeneratedCode] = useState<string>('');
	const [draggedTab, setDraggedTab] = useState<string | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [previousTabs, setPreviousTabs] = useState<Tab[]>([]);
	const [dragOverTab, setDragOverTab] = useState<string | null>(null);
	const [previewOrder, setPreviewOrder] = useState<number[]>([]);

	// Load tabs from localStorage on mount
	useEffect(() => {
		const loaded = loadTabsFromStorage();
		setTabsState(loaded);
		if (loaded.tabs.length > 0 && !loaded.activeTabId) {
			setTabsState(prev => ({ ...prev, activeTabId: loaded.tabs[0].id }));
		}
	}, []);

	// Save to localStorage whenever state changes
	useEffect(() => {
		if (tabsState.tabs.length > 0) {
			saveTabsToStorage(tabsState);
		}
	}, [tabsState]);

	// Generate code whenever tabs change
	useEffect(() => {
		if (tabsState.tabs.length > 0) {
			generateCode();
		}
	}, [tabsState.tabs]);

	const addTab = () => {
		if (tabsState.tabs.length >= 15) {
			alert('Maximum 15 tabs allowed');
			return;
		}

		const newTab: Tab = {
			id: generateTabId(),
			heading: `Step ${tabsState.tabs.length + 1}`,
			content: '',
			order: tabsState.tabs.length
		};

		setTabsState(prev => ({
			...prev,
			tabs: [...prev.tabs, newTab],
			activeTabId: newTab.id
		}));
	};

	const deleteTab = (tabId: string) => {
		if (tabsState.tabs.length <= 1) {
			alert('At least one tab is required');
			return;
		}

		setIsAnimating(true);
		setPreviousTabs(tabsState.tabs);

		setTimeout(() => {
			setTabsState(prev => {
				const newTabs = prev.tabs.filter(tab => tab.id !== tabId);
				
				// Renumber tabs chronologically
				const renumberedTabs = newTabs.map((tab, index) => ({
					...tab,
					heading: `Step ${index + 1}`,
					order: index
				}));
				
				const newActiveId = prev.activeTabId === tabId 
					? (renumberedTabs[0]?.id || null)
					: prev.activeTabId;
				
				return {
					tabs: renumberedTabs,
					activeTabId: newActiveId
				};
			});
			setIsAnimating(false);
		}, 300);
	};

	const updateTab = (tabId: string, updates: Partial<Pick<Tab, 'heading' | 'content'>>) => {
		setTabsState(prev => ({
			...prev,
			tabs: prev.tabs.map(tab => 
				tab.id === tabId ? { ...tab, ...updates } : tab
			)
		}));
	};

	// Drag and drop functionality with real-time preview
	const handleDragStart = (e: React.DragEvent, tabId: string) => {
		setDraggedTab(tabId);
		setPreviewOrder(tabsState.tabs.map((_, index) => index));
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', tabId);
	};

	const handleDragOver = (e: React.DragEvent, targetTabId: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		
		if (!draggedTab || draggedTab === targetTabId) return;
		
		setDragOverTab(targetTabId);
		
		const draggedIndex = tabsState.tabs.findIndex(tab => tab.id === draggedTab);
		const targetIndex = tabsState.tabs.findIndex(tab => tab.id === targetTabId);
		
		if (draggedIndex === -1 || targetIndex === -1) return;
		
		// Calculate new order for real-time preview
		const newOrder = [...tabsState.tabs];
		const draggedTabData = newOrder[draggedIndex];
		
		// Remove from current position
		newOrder.splice(draggedIndex, 1);
		
		// Insert at new position
		const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
		newOrder.splice(newTargetIndex, 0, draggedTabData);
		
		// Update preview order
		const previewIndices = newOrder.map((_, index) => index);
		setPreviewOrder(previewIndices);
	};

	const handleDragLeave = () => {
		setDragOverTab(null);
		setPreviewOrder(tabsState.tabs.map((_, index) => index));
	};

	const handleDrop = (e: React.DragEvent, targetTabId: string) => {
		e.preventDefault();
		
		if (!draggedTab || draggedTab === targetTabId) {
			setDraggedTab(null);
			setDragOverTab(null);
			setPreviewOrder([]);
			return;
		}

		const draggedIndex = tabsState.tabs.findIndex(tab => tab.id === draggedTab);
		const targetIndex = tabsState.tabs.findIndex(tab => tab.id === targetTabId);

		if (draggedIndex === -1 || targetIndex === -1) {
			setDraggedTab(null);
			setDragOverTab(null);
			setPreviewOrder([]);
			return;
		}

		// Apply the reordering
		const newTabs = [...tabsState.tabs];
		const draggedTabData = newTabs[draggedIndex];
		
		newTabs.splice(draggedIndex, 1);
		const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
		newTabs.splice(newTargetIndex, 0, draggedTabData);

		// Renumber all tabs chronologically
		const renumberedTabs = newTabs.map((tab, index) => ({
			...tab,
			heading: `Step ${index + 1}`,
			order: index
		}));

		setTabsState(prev => ({
			...prev,
			tabs: renumberedTabs
		}));

		setDraggedTab(null);
		setDragOverTab(null);
		setPreviewOrder([]);
	};

	const handleDragEnd = () => {
		setDraggedTab(null);
		setDragOverTab(null);
		setPreviewOrder([]);
	};

	const generateCode = () => {
		if (tabsState.tabs.length === 0) {
			setGeneratedCode('');
			return;
		}

		const tabs = tabsState.tabs;
		const activeIndex = tabs.findIndex(tab => tab.id === tabsState.activeTabId);
		
		const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabs</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
	.container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: visible; }
	/* Make tabs horizontally scrollable so many tabs aren't clipped */
	.tabs { display: flex; background: #f8f9fa; border-bottom: 1px solid #dee2e6; overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
	.tabs::-webkit-scrollbar { height: 8px; }
	.tabs::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 8px; }
	.tab { padding: 12px 20px; cursor: pointer; border-right: 1px solid #dee2e6; background: #f8f9fa; flex: 0 0 auto; white-space: nowrap; }
        .tab.active { background: white; border-bottom: 2px solid #007bff; }
        .tab:hover { background: #e9ecef; }
        .tab-content { padding: 20px; min-height: 200px; }
        .content { white-space: pre-wrap; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="tabs">
            ${tabs.map((tab, index) => `
                <div class="tab ${index === activeIndex ? 'active' : ''}" onclick="showTab(${index})">${tab.heading}</div>
            `).join('')}
        </div>
        <div class="tab-content">
            <div class="content">${tabs[activeIndex]?.content || ''}</div>
        </div>
    </div>

    <script>
        const tabs = ${JSON.stringify(tabs)};
        let currentTab = ${activeIndex};
        
        function showTab(index) {
            currentTab = index;
            document.querySelectorAll('.tab').forEach((tab, i) => {
                tab.classList.toggle('active', i === index);
            });
            document.querySelector('.content').textContent = tabs[index].content;
        }
    </script>
</body>
</html>`;

		setGeneratedCode(html);
	};

	const downloadCode = () => {
		const blob = new Blob([generatedCode], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'tabs.html';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const copyCode = () => {
		navigator.clipboard.writeText(generatedCode);
		alert('Code copied to clipboard!');
	};

	const activeTab = tabsState.tabs.find(tab => tab.id === tabsState.activeTabId);

	return (
		<div className="text-gray-900 dark:text-gray-100">
			<h1 className="text-3xl font-bold mb-8">Tabs Generator</h1>
			
			{/* 3-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				
				{/* Left Column: Tabs Management */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Tabs Headers:</h2>
						<button
							onClick={addTab}
							disabled={tabsState.tabs.length >= 15}
							className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
						>
							+ Add
						</button>
					</div>
					
					<div className="space-y-2">
						{tabsState.tabs.map((tab, index) => {
							// Calculate visual position based on drag preview
							const isDragging = draggedTab === tab.id;
							const isDragOver = dragOverTab === tab.id;
							const draggedIndex = draggedTab ? tabsState.tabs.findIndex(t => t.id === draggedTab) : -1;
							const targetIndex = dragOverTab ? tabsState.tabs.findIndex(t => t.id === dragOverTab) : -1;
							
							// Calculate transform for real-time preview
							let transform = 'translateY(0)';
							if (isDragging) {
								transform = 'translateY(0) scale(0.95)';
							} else if (draggedTab && !isDragging) {
								// Other tabs shift to make space
								if (draggedIndex !== -1 && targetIndex !== -1) {
									if (draggedIndex < targetIndex && index > draggedIndex && index <= targetIndex) {
										transform = 'translateY(-8px)';
									} else if (draggedIndex > targetIndex && index >= targetIndex && index < draggedIndex) {
										transform = 'translateY(8px)';
									}
								}
							}
							
							return (
								<div 
									key={tab.id} 
									className={`flex items-center gap-2 transition-all duration-200 ease-out`}
									style={{ transform }}
								>
									<button
										draggable
										onDragStart={(e) => handleDragStart(e, tab.id)}
										onDragOver={(e) => handleDragOver(e, tab.id)}
										onDragLeave={handleDragLeave}
										onDrop={(e) => handleDrop(e, tab.id)}
										onDragEnd={handleDragEnd}
										onClick={() => setTabsState(prev => ({ ...prev, activeTabId: tab.id }))}
										className={`px-3 py-2 rounded border text-sm cursor-move transition-all duration-200 ${
											tab.id === tabsState.activeTabId
												? 'bg-blue-600 text-white border-blue-600 scale-105'
												: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-102'
										} ${
											isDragging ? 'opacity-50 scale-95 shadow-lg' : ''
										} ${
											isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
										}`}
									>
										<span className="cursor-move flex items-center gap-2">
											<span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">⋮⋮</span>
											<span>{tab.heading}</span>
										</span>
									</button>
									<button
										onClick={() => deleteTab(tab.id)}
										className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded text-sm transition-all duration-200 hover:scale-110"
										disabled={tabsState.tabs.length <= 1}
									>
										−
									</button>
								</div>
							);
						})}
					</div>
				</div>

				{/* Middle Column: Table of Contents */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Tabs Content:</h2>
					
					{activeTab ? (
						<div className="border border-gray-300 dark:border-gray-600 rounded p-4 min-h-[300px] transition-all duration-300 ease-in-out transform hover:scale-[1.01]">
							<h3 className="font-semibold mb-3 transition-colors duration-200">{activeTab.heading}</h3>
							<textarea
								value={activeTab.content}
								onChange={(e) => updateTab(activeTab.id, { content: e.target.value })}
								placeholder="Enter tab content here..."
								className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					) : (
						<div className="border border-gray-300 dark:border-gray-600 rounded p-4 min-h-[300px] flex items-center justify-center text-gray-500 transition-all duration-300">
							No tabs available. Click &quot;Add&quot; to create your first tab.
						</div>
					)}
				</div>

				{/* Right Column: Output */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Output:</h2>
						<div className="flex gap-2">
							<button
								onClick={copyCode}
								disabled={!generatedCode}
								className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
							>
								Copy
							</button>
							<button
								onClick={downloadCode}
								disabled={!generatedCode}
								className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
							>
								Download
							</button>
						</div>
					</div>
					
					<div className="border border-gray-300 dark:border-gray-600 rounded p-4 min-h-[300px] transition-all duration-300 ease-in-out transform hover:scale-[1.01]">
						<pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-auto max-h-64 transition-all duration-200">
							{generatedCode || 'Generated HTML code will appear here...'}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
