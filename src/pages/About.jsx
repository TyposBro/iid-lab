/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Down_left_dark_arrow } from "@/assets/";
import { MainCarousel } from "@/components";
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";

export const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const { isAdmin, adminToken } = useAdmin();

  useEffect(() => {
    fetch(`${BASE_URL}/about`)
      .then((res) => res.json())
      .then((data) => setAboutData(data))
      .catch((err) => console.error("Failed to fetch about page:", err));
  }, []);

  const handleSave = async () => {
    const response = await fetch(`${BASE_URL}/about`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aboutData),
    });

    if (response.ok) {
      alert("About page updated!");
    } else {
      alert("Failed to update about page.");
    }
  };

  if (!aboutData) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-start items-center px-8 pt-16 w-full h-dvh overflow-y-scroll">
      {isAdmin && (
        <button className="bg-red-500 text-white p-2 rounded-md" onClick={handleSave}>
          Save Changes
        </button>
      )}
      <Intro aboutData={aboutData} setAboutData={setAboutData} isAdmin={isAdmin} />
      <Tracks />
      <Details aboutData={aboutData} setAboutData={setAboutData} isAdmin={isAdmin} />
    </div>
  );
};

const Intro = ({ aboutData, setAboutData, isAdmin }) => {
  const handleChange = (e) => {
    setAboutData({ ...aboutData, intro: e.target.value });
  };

  return (
    <div className="flex flex-col gap-8 py-8 w-full">
      <MainCarousel slides={aboutData.images} />
      {isAdmin ? (
        <textarea value={aboutData.intro} onChange={handleChange} className="border p-2 w-full" />
      ) : (
        <h3 className="text-lg text-gray-600">{aboutData.intro}</h3>
      )}
    </div>
  );
};

const Tracks = () => {
  return (
    <div className="flex flex-col gap-8 py-8 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light text-gray-800">Research Tracks</h2>
        <Down_left_dark_arrow className="size-[58px]" />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {[
          "Integrated Design",
          "Pervasive Design",
          "Engineering Design",
          "Transformable Design",
        ].map((track) => (
          <button
            key={track}
            className="border border-blue-500 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white"
          >
            {track}
          </button>
        ))}
      </div>
    </div>
  );
};

const Details = ({ aboutData, setAboutData, isAdmin }) => {
  const handleChange = (e) => {
    setAboutData({ ...aboutData, details: e.target.value });
  };

  return (
    <div className="flex flex-col gap-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-gray-800">Integration Innovation Design</h1>
      {isAdmin ? (
        <textarea value={aboutData.details} onChange={handleChange} className="border p-2 w-full" />
      ) : (
        <h3 className="text-lg text-gray-600">{aboutData.details}</h3>
      )}
    </div>
  );
};

export default About;
