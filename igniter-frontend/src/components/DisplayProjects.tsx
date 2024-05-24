// DisplayProjects.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

import InvestCard from "./InvestCard";
import loader  from "../assets/loader.svg";
import { Project } from "../pages/type"; 

interface Project {
  id: string;
  title: string;
  founder: string;
  description: string;
  goal: number;
  deadline: Date;
  balance: number;
  image: string;
}

interface DisplayProjectsProps {
  title: string;
  isLoading: boolean;
  projects: Project[];
}

const DisplayProjects: React.FC<DisplayProjectsProps> = ({ title, isLoading, projects }) => {
  const navigate = useNavigate();

  const handleNavigate = (project: Project) => {
    navigate(`/project-details/${project.title}`, { state: project });
  };

  return (
    <div>
      {title === "Live Projects" && (
        <div className="flex flex-col justify-left items-left my-[80px]">
          <div>
            <h1 className="font-epilogue font-semibold lg:text-[40px] sm:text-[32px] text-left text-[#8c6dfd]">
              Welcome onboard 🚀
            </h1>
          </div>
          <div>
            <h1 className="font-epilogue font-semibold lg:text-[40px] sm:text-[32px] text-white text-left ">
              It's Crowd-Investing Platform Powered <br /> by Blockchain &
              Crypto.
            </h1>
          </div>
        </div>
      )}

      <h1 className="flex flex-row items-center font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({projects.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] mb-[100px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && projects.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any project yet
          </p>
        )}

        {!isLoading &&
          projects.length > 0 &&
          projects.map((project) => (
            <InvestCard
              key={project.id}
              {...project}
              handleClick={() => handleNavigate(project)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayProjects;
