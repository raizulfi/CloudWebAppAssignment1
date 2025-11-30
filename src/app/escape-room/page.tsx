"use client";

import LastVisitedRedirect from "@/components/LastVisitedRedirect";
import { useState, useEffect } from "react";

interface Stage {
	id: number;
	title: string;
	description: string;
	type: "format" | "debug" | "generate" | "convert";
}

const stages: Stage[] = [
	{
		id: 1,
		title: "Stage 1: Format Python Code Correctly",
		description: "Format the following Python code properly with correct indentation:",
		type: "format",
	},
	{
		id: 2,
		title: "Stage 2: Debug the Python Code",
		description: "Find and click on the bug in the Python code to debug it:",
		type: "debug",
	},
	{
		id: 3,
		title: "Stage 3: Generate Numbers in Python",
		description: "Write Python code to generate all numbers from 0 to 1000:",
		type: "generate",
	},
	{
		id: 4,
		title: "Stage 4: Data Format Conversion (Python)",
		description: "Convert the data from JSON to CSV format using Python:",
		type: "convert",
	},
];

export default function EscapeRoomPage() {
	const [currentStage, setCurrentStage] = useState(0);
	const [timeLimit, setTimeLimit] = useState(600); // 10 minutes default
	const [timeRemaining, setTimeRemaining] = useState(timeLimit);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameWon, setGameWon] = useState(false);
	const [gameLost, setGameLost] = useState(false);

	// Stage 1: Format Python Code
	const [userCode, setUserCode] = useState(
		"def hello():print('Hello')if True:return 'World'"
	);
	const correctFormatted = `def hello():\n    print('Hello')\n    if True:\n        return 'World'`;

	// Stage 2: Debug Code
	const [bugFound, setBugFound] = useState(false);

	// Stage 3: Generate Numbers
	const [generateCode, setGenerateCode] = useState("");

	// Stage 4: Data Conversion
	const [conversionCode, setConversionCode] = useState("");

	// Timer effect
	useEffect(() => {
		if (isTimerRunning && timeRemaining > 0 && !gameWon && !gameLost) {
			const timer = setTimeout(() => {
				setTimeRemaining(timeRemaining - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (timeRemaining === 0 && !gameWon) {
			setGameLost(true);
			setIsTimerRunning(false);
		}
	}, [isTimerRunning, timeRemaining, gameWon, gameLost]);

	const startGame = () => {
		setGameStarted(true);
		setIsTimerRunning(true);
		setCurrentStage(0);
		setGameWon(false);
		setGameLost(false);
		setTimeRemaining(timeLimit);
		setBugFound(false);
		setUserCode("def hello():print('Hello')if True:return 'World'");
		setGenerateCode("");
		setConversionCode("");
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const checkStage1 = () => {
		const normalizeWhitespace = (str: string) =>
			str.replace(/\s+/g, " ").trim();
		if (normalizeWhitespace(userCode) === normalizeWhitespace(correctFormatted)) {
			nextStage();
		} else {
			alert("Not quite right. Check your indentation and spacing!");
		}
	};

	const checkStage2 = () => {
		if (bugFound) {
			nextStage();
		} else {
			alert("Find and click on the bug in the code!");
		}
	};

	const checkStage3 = () => {
		try {
			// Simulate Python code execution (basic validation)
			const pyCode = generateCode.trim();
			const correct = [
				"for i in range(1001): print(i)",
				"print(list(range(1001)))",
				"numbers = list(range(1001))\nprint(numbers)",
			];
			if (correct.some(c => pyCode.replace(/\s+/g, " ") === c.replace(/\s+/g, " "))) {
				nextStage();
			} else {
				alert("Your code doesn't generate the correct numbers! Try using range(1001) in Python.");
			}
		} catch {
			alert("There's an error in your code. Try again!");
		}
	};

	const checkStage4 = () => {
		try {
			const pyCode = conversionCode.trim().toLowerCase();
			// Check if they're parsing the data and printing CSV format
			const hasDataParse = pyCode.includes("data = json.loads") || pyCode.includes("data=json.loads");
			const hasPrintHeader = pyCode.includes("print('name,age')") || pyCode.includes('print("name,age")');
			const hasLoop = pyCode.includes("for") && pyCode.includes("in data");
			
			if (hasDataParse && hasPrintHeader && hasLoop) {
				setGameWon(true);
				setIsTimerRunning(false);
			} else {
				alert("Not quite right! Make sure you:\n1. Parse the JSON with json.loads()\n2. Print the header 'name,age'\n3. Loop through the data and print each row");
			}
		} catch {
			alert("There's an error in your code. Try again!");
		}
	};

	const nextStage = () => {
		if (currentStage < stages.length - 1) {
			setCurrentStage(currentStage + 1);
		}
	};

	const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			const value = target.value;

			// Insert tab character at cursor position
			const newValue = value.substring(0, start) + "    " + value.substring(end);
			
			// Update the textarea value based on which stage we're on
			if (currentStage === 0) {
				setUserCode(newValue);
			} else if (currentStage === 2) {
				setGenerateCode(newValue);
			} else if (currentStage === 3) {
				setConversionCode(newValue);
			}

			// Set cursor position after the inserted tab
			setTimeout(() => {
				target.selectionStart = target.selectionEnd = start + 4;
			}, 0);
		}
	};

	const renderStage = () => {
		const stage = stages[currentStage];

		switch (stage.type) {
			case "format":
				return (
					<div className="space-y-4">
						<p className="text-lg mb-4 text-gray-900 dark:text-gray-100">{stage.description}</p>
						<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<p className="text-sm mb-2 text-gray-700 dark:text-gray-300">Unformatted code:</p>
							<code className="text-blue-700 dark:text-blue-300 text-sm">
								def hello():print(&apos;Hello&apos;)if True:return &apos;World&apos;
							</code>
						</div>
					<textarea
						value={userCode}
						onChange={(e) => setUserCode(e.target.value)}
						onKeyDown={handleTabKey}
						className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-900 text-blue-700 dark:text-blue-300 font-mono text-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none"
						placeholder="Format the Python code here..."
					/>
						<button
							onClick={checkStage1}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-white"
						>
							Submit Code
						</button>
					</div>
				);

			case "debug":
				return (
					<div className="space-y-4">
						<p className="text-lg mb-4 text-gray-900 dark:text-gray-100">{stage.description}</p>
					<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg relative">
						<pre className="text-blue-700 dark:text-blue-300 text-sm font-mono">
							<code>
								{`def calculate_sum(a, b):\n    sum = a + b\n    print(sum)\n    return su`}
								<span
									onClick={() => setBugFound(true)}
									className="cursor-pointer hover:bg-red-600 px-1 relative group"
									title="Click the bug!"
								>
									🐛
									{!bugFound && (
										<span className="absolute -top-8 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
											Bug here!
										</span>
									)}
								</span>
								{`  # Bug: should be 'sum'\n`}
							</code>
						</pre>
					</div>
						{bugFound && (
							<p className="text-blue-700 dark:text-blue-300 font-semibold">
								✓ Bug found! The return statement should be &apos;return sum&apos;
							</p>
						)}
						<button
							onClick={checkStage2}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-white"
						>
							Continue
						</button>
					</div>
				);

			case "generate":
				return (
					<div className="space-y-4">
						<p className="text-lg mb-4 text-gray-900 dark:text-gray-100">{stage.description}</p>
						<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
								Hint: Use <span className="font-mono">range(1001)</span> in Python to generate numbers from 0 to 1000
							</p>
							<p className="text-xs text-gray-500">
								Your code should print or return all numbers from 0 to 1000
							</p>
						</div>
					<textarea
						value={generateCode}
						onChange={(e) => setGenerateCode(e.target.value)}
						onKeyDown={handleTabKey}
						className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-900 text-blue-700 dark:text-blue-300 font-mono text-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none"
						placeholder="# Example: print(list(range(1001)))"
					/>
						<button
							onClick={checkStage3}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-white"
						>
							Submit Code
						</button>
					</div>
				);

			case "convert":
				return (
					<div className="space-y-4">
						<p className="text-lg mb-4 text-gray-900 dark:text-gray-100">{stage.description}</p>
						<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<p className="text-sm mb-2 text-gray-700 dark:text-gray-300">Input JSON:</p>
							<code className="text-blue-700 dark:text-blue-300 text-sm block mb-4">
								[&#123;&quot;name&quot;:&quot;John&quot;,&quot;age&quot;:30&#125;, &#123;&quot;name&quot;:&quot;Jane&quot;,&quot;age&quot;:25&#125;]
							</code>
							<p className="text-sm mb-2 text-gray-700 dark:text-gray-300">Expected CSV output:</p>
							<code className="text-blue-700 dark:text-blue-300 text-sm block">
								name,age<br />
								John,30<br />
								Jane,25
							</code>
						</div>
						<p className="text-xs text-gray-500 mb-2">
							<strong>Task:</strong> Complete the missing lines to convert JSON to CSV format.
						</p>
						<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-2">
							<p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Starter code (already provided):</p>
							<pre className="text-blue-700 dark:text-blue-300 text-xs font-mono">
								{`import json

json_str = '[{"name":"John","age":30},{"name":"Jane","age":25}]'

# Your code below:`}
							</pre>
						</div>
					<textarea
						value={conversionCode}
						onChange={(e) => setConversionCode(e.target.value)}
						onKeyDown={handleTabKey}
						className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-900 text-blue-700 dark:text-blue-300 font-mono text-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none"
						placeholder={"# Example:\ndata = json.loads(json_str)\nprint('name,age')\nfor item in data:\n    print(f\"{item['name']},{item['age']}\")"}
					/>
						<button
							onClick={checkStage4}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-white"
						>
							Submit Code
						</button>
					</div>
				);
		}
	};

	return (
		<section>
			<LastVisitedRedirect />
			<div className="min-h-screen relative" style={{
				backgroundImage: "url('/image.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundAttachment: "fixed",
			}}>
				<div className="container mx-auto px-4 py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100 text-2xl drop-shadow-lg  bg-white dark:bg-gray-800 bg-opacity-70 rounded-lg inline-block px-6 py-2">
							🔐 Escape Room Challenge
						</h1>
						<p className="font-bold text-gray-900 dark:text-gray-100 text-2xl drop-shadow-lg  bg-white dark:bg-gray-800 bg-opacity-70 rounded-lg inline-block px-6 py-2">
							Code your way out! Complete all stages before time runs out. 🫡
						</p>
					</div>

					{!gameStarted ? (
						<div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700">
							<h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
								Set Your Timer
							</h2>
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
										Time Limit (seconds):
									</label>
									<input
										type="number"
										value={timeLimit}
										onChange={(e) => setTimeLimit(Number(e.target.value))}
										className="w-full p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
										min="60"
										max="3600"
									/>
									<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
										Recommended: 600 seconds (10 minutes)
									</p>
								</div>
								<button
									onClick={startGame}
									className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors"
								>
									Start Escape Room
								</button>
							</div>
							<div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<h3 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
									Mission Brief:
								</h3>
								<ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
									<li>✓ Stage 1: Format code correctly</li>
									<li>✓ Stage 2: Find and debug the code</li>
									<li>✓ Stage 3: Generate numbers 0-1000</li>
									<li>✓ Stage 4: Convert JSON to CSV</li>
								</ul>
							</div>
						</div>
					) : gameWon ? (
						<div className="max-w-2xl mx-auto bg-green-50 dark:bg-green-900 p-8 rounded-lg shadow-2xl border-2 border-green-500 dark:border-green-600 text-center">
							<h2 className="text-4xl font-bold mb-4 text-green-700 dark:text-green-300">
								🎉 Congratulations!
							</h2>
							<p className="text-xl mb-4 text-gray-800 dark:text-gray-200">
								You&apos;ve escaped the room with{" "}
								<span className="font-bold text-green-600 dark:text-green-300">
									{formatTime(timeRemaining)}
								</span>{" "}
								remaining!
							</p>
							<p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
								All stages completed successfully. You&apos;re a coding master!
							</p>
							<button
								onClick={startGame}
								className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-colors"
							>
								Play Again
							</button>
						</div>
					) : gameLost ? (
						<div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900 p-8 rounded-lg shadow-2xl border-2 border-red-500 dark:border-red-600 text-center">
							<h2 className="text-4xl font-bold mb-4 text-red-700 dark:text-red-300">
								⏰ Time&apos;s Up!
							</h2>
							<p className="text-xl mb-4 text-gray-800 dark:text-gray-200">
								You ran out of time and couldn&apos;t escape the room.
							</p>
							<p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
								You completed{" "}
								<span className="font-bold text-red-600 dark:text-red-300">
									{currentStage} out of {stages.length}
								</span>{" "}
								stages.
							</p>
							<button
								onClick={startGame}
								className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-colors"
							>
								Try Again
							</button>
						</div>
					) : (
						<div className="max-w-4xl mx-auto">
							{/* Timer and Progress */}
							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6 border border-gray-300 dark:border-gray-700">
								<div className="flex justify-between items-center mb-2">
									<div className="flex items-center gap-4">
										<span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
											Stage {currentStage + 1} of {stages.length}
										</span>
										<div className="flex gap-2">
											{stages.map((_, idx) => (
												<div
													key={idx}
													className={`w-3 h-3 rounded-full ${
														idx < currentStage
															? "bg-green-500"
															: idx === currentStage
															? "bg-blue-500"
															: "bg-gray-400 dark:bg-gray-600"
													}`}
												/>
											))}
										</div>
									</div>
									<div
										className={`text-2xl font-bold ${
											timeRemaining < 60 ? "text-red-500 animate-pulse" : "text-yellow-600 dark:text-yellow-400"
										}`}
									>
										⏱️ {formatTime(timeRemaining)}
									</div>
								</div>
								<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
									<div
										className="bg-blue-500 h-2 rounded-full transition-all duration-300"
										style={{
											width: `${((currentStage + 1) / stages.length) * 100}%`,
										}}
									/>
								</div>
							</div>

							{/* Current Stage */}
							<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700">
								<h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
									{stages[currentStage].title}
								</h2>
								{renderStage()}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}


