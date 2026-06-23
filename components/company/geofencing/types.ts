export type LocationLog = {
  name: string;
  time: string;
  location: string;
  status: "Check In" | "Check Out" | "In Zone" | "Out of Zone";
};
