"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateUser, loadGameProgress, checkUserExists } from "@/lib/api-client";
import { setUserCredentials } from "@/lib/user-session";

export default function UserLoginPage() {
  const [userTag, setUserTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoadOptions, setShowLoadOptions] = useState(false);
  const router = useRouter();

  const handleCreateNewGame = async () => {
    if (!userTag.trim()) {
      setError("Please enter a user tag");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if userTag already exists
      const exists = await checkUserExists(userTag.trim());
      
      if (exists) {
        setError("This user tag is already taken. Please choose another one or load your existing game.");
        setLoading(false);
        return;
      }

      const user = await getOrCreateUser(userTag.trim());
      // Store user ID in localStorage for the game
      setUserCredentials(user.id, user.userTag);
      // Redirect to escape room and start a new game
      router.push("/escape-room?newGame=true");
    } catch (err) {
      setError("Failed to create user. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadGame = async () => {
    if (!userTag.trim()) {
      setError("Please enter a user tag");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await getOrCreateUser(userTag.trim());
      setUserCredentials(user.id, user.userTag);

      const progress = await loadGameProgress(user.id);

      if (!progress || !progress.gameStarted) {
        setError("No saved game found for this user. Start a new game instead.");
        setShowLoadOptions(false);
      } else {
        // Redirect to escape room and load the game
        router.push("/escape-room?loadGame=true");
      }
    } catch (err) {
      setError("Failed to load game. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
              🔐 Escape Room
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Code your way out of the room!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Your User Tag
              </label>
              <input
                type="text"
                value={userTag}
                onChange={(e) => {
                  setUserTag(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !showLoadOptions) {
                    handleCreateNewGame();
                  }
                }}
                placeholder="username or ID"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use any unique identifier (can be your name, username, etc.)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!showLoadOptions ? (
              <div className="space-y-3">
                <button
                  onClick={handleCreateNewGame}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Loading..." : "Start New Game"}
                </button>

                <button
                  onClick={() => setShowLoadOptions(true)}
                  disabled={loading}
                  className="w-full py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Loading..." : "Load Saved Game"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleLoadGame}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Loading..." : "Load My Game"}
                </button>

                <button
                  onClick={() => {
                    setShowLoadOptions(false);
                    setError("");
                  }}
                  disabled={loading}
                  className="w-full py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
              💡 About Your User Tag
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Your user tag is used to save and load your game progress. Use the same tag to continue where you left off!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
