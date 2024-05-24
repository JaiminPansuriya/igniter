import React, { useContext, createContext, ReactNode } from "react";
import {
  useAddress,
  useContract,
  useConnect,
  useContractWrite,
  useDisconnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Define the types for the form, project, and investment
interface Form {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
}

interface Project {
  founder: string;
  title: string;
  description: string;
  goal: string;
  deadline: number;
  balance: string;
  image: string;
  pId: number;
}

interface Investment {
  investor: string;
  investment: string;
}

// Define the context type
interface StateContextType {
  address: string | undefined;
  contract: any;
  connect: () => void;
  disconnectWallet: () => void;
  createProject: (form: Form) => Promise<void>;
  getProjects: () => Promise<Project[]>;
  getUserProjects: () => Promise<Project[]>;
  invest: (pId: number, amount: string) => Promise<void>;
  getInvestments: (pId: number) => Promise<Investment[]>;
}

// Create a context for the state
const StateContext = createContext<StateContextType | undefined>(undefined);

// Define the provider props type
interface StateContextProviderProps {
  children: ReactNode;
}

// Create a provider component to wrap around the app
export const StateContextProvider = ({ children }: StateContextProviderProps) => {
  // Get the contract instance from the blockchain
  const { contract } = useContract(
    "0x5df8649464431D2ED1FD9042b2375f35A78b6095"
  );
  // Get a function to create a new project in the contract
  const { mutateAsync: createProject } = useContractWrite(
    contract,
    "createProject"
  );

  // Get the user's address
  const address = useAddress();

  // Get a function to connect to the user's MetaMask wallet
  const connect = useConnect();

  // Get a function to disconnect from the user's MetaMask wallet
  const disconnectWallet = useDisconnect();

  // Create a function to publish a new project
  const publishProject = async (form: Form) => {
    try {
      if (!address) throw new Error("No address found");

      // Define the parameters for createProject explicitly
      const params: [string, string, string, string, number, string] = [
        address, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline
        form.image,
      ];

      // Call the contract's createProject function with the necessary parameters
      const data = await createProject({ args: params });
      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  // Create a function to get all projects from the contract
  const getProjects = async (): Promise<Project[]> => {
    // Call the contract's getProjects function to retrieve all projects
    const projects = await contract.call("getProjects");
    const { formatEther } = ethers;
    // Parse the projects array and format the values as necessary
    const parsedCampaings = projects.map((project: any, i: number) => ({
      founder: project.founder,
      title: project.title,
      description: project.description,
      goal: formatEther(project.goal.toString()),
      deadline: project.deadline.toNumber(),
      balance: formatEther(project.balance.toString()),
      image: project.image,
      pId: i,
    }));

    return parsedCampaings;
  };

  // Create a function to get all projects created by the current user
  const getUserProjects = async (): Promise<Project[]> => {
    // Retrieve all projects
    const allProjects = await getProjects();

    // Filter the projects array to get only the projects created by the current user
    const filteredProjects = allProjects.filter(
      (project) => project.founder === address
    );

    return filteredProjects;
  };

  // Create a function to invest in a project
  const invest = async (pId: number, amount: string): Promise<void> => {
    try {
      // Parse the amount to BigNumber
      const parsedAmount = ethers.parseEther(amount);

      // Call the contract's investToProject function with the necessary parameters
      const data = await contract.call("investToProject", pId, {
        value: parsedAmount,
      });

      console.log("Investment successful", data);
    } catch (error) {
      console.log("Investment failed", error);
    }
  };

  // Create a function to get all investments for a project
  const getInvestments = async (pId: number): Promise<Investment[]> => {
    // Call the contract's getInvestors function with the necessary parameter
    const investments = await contract.call("getInvestors", pId);
    const numberOfInvestments = investments[0].length;

    const parsedInvestments: Investment[] = [];

    // Create an array of objects with the investor's address and the amount invested
    for (let i = 0; i < numberOfInvestments; i++) {
      parsedInvestments.push({
        investor: investments[0][i],
        investment: ethers.utils.formatEther(investments[1][i].toString()),
      });
    }

    return parsedInvestments;
  };

  // Return the state context provider with all the necessary state and functions
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnectWallet,
        createProject: publishProject,
        getProjects,
        getUserProjects,
        invest,
        getInvestments,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the state context
export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateContextProvider");
  }
  return context;
};
