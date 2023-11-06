import { Link } from 'react-router-dom';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Link to="/filter">Date filter</Link>
      <Link to="/trello">Trello</Link>
    </div>
  );
}

export default App;
