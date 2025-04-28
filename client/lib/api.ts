import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const fetchOrganizations = async () => {
  const res = await API.get("/organizations");
  return res.data;
};

export const fetchPlayers = async () => {
  const res = await API.get("/players");
  return res.data;
};

export const createPlayer = async (playerData: any) => {
  const res = await API.post("/players", playerData);
  return res.data;
};

export const createOrganization = async (orgData: { name: string }) => {
  const res = await API.post("/organizations", orgData);
  return res.data;
};

export async function updatePlayer(playerId: string, updatedData: any) {
  const res = await API.put(`/players/${playerId}`, updatedData);
  return res.data;
}
