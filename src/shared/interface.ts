import { Dispatch, RefObject } from "react";

export interface IWelcomeProps {
  setWelcome: Dispatch<React.SetStateAction<boolean>>;
}

export interface IGenericAvatarProps {
  isLeft: boolean;
  animate: boolean;
  src: string;
  alt: string;
}

export interface IUser {
  id: string;
  available: boolean;
}

export interface IGVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  label?: string | null;
  isLoading?: boolean;
  isMuted?: boolean;
}
