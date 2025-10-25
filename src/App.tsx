import { DialInterface } from './components/DialInterface';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center p-4">
      <h1 className="font-bold text-white mt-8 mb-8 select-none uppercase" style={{ fontSize: '3rem' }}>
        Headlines
      </h1>
      <DialInterface />
    </div>
  );
}

export default App;
