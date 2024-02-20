export interface User {
  index: number;
  name: string;
  password: string;
}


export interface ResponseRegistration {
    name: string,
    index: number,
    error: boolean,
    errorText: string,
  }

  export interface Room {
    roomId: number;
    roomUsers: RoomUser[];
  }

  export interface RoomUser {
    name: string,
    index: number,  
  }