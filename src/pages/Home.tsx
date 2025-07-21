import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-yellow-400 mb-0">
        Art Project
      </p>
      <h1 className="text-[48px] md:text-[80px] font-extrabold leading-tight mb-4 drop-shadow-lg">
        1M FACES
      </h1>
      <p className="text-base md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
        A living mosaic. A cast of the face of humanity.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/participate")}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-200 glow-on-hover"
        >
          PARTICIPATE
        </button>

        <button
          onClick={() => navigate("/map")}
          className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200 glow-on-hover"
        >
          EXPLORE FACES
        </button>

        <button
          onClick={() => navigate("/map?filters=true")}
          className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200 glow-on-hover"
        >
          AI
        </button>
      </div>
    </div>
  );
}
