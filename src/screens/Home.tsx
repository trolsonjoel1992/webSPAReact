import { useNavigate } from 'react-router';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <button onClick={() => navigate('/admin')}>Go to not found</button>
    </div>
  );
}
