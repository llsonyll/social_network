import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";

const Home = () => {
  return (
    <div className=" h-full container">
      <Friends/>
    <Post/>
    </div>
  );
};

export default Home;
