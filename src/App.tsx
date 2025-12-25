import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { SimulationDashboard } from './components/SimulationDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Trash Buddy System Design</h1>
        <div>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      
      <main>
        <SignedIn>
          <SimulationDashboard />
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-6">Please sign in to access the simulation dashboard.</p>
            <div className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <SignInButton mode="modal" />
            </div>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}

export default App;
