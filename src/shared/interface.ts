import { Dispatch } from "react";

export interface IWelcomeProps {
  setWelcome: Dispatch<React.SetStateAction<boolean>>;
}

export interface IGenericAvatarProps {
  isLeft: boolean;
  animate: boolean;
  src: string;
  alt: string;
}
