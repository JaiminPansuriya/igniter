declare module "../constants" {
    export interface NavLink {
      name: string;
      imgUrl: string;
      link: string;
      disabled?: boolean;
    }
  
    export const navlinks: NavLink[];
  }
  
  export {}; // Add this line to indicate that this file is a module
  