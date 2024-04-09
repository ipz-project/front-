import axios from "axios";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { useCookies } from "react-cookie";

const BASE_URL = "http://localhost:8080/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const TalentsService = {
  async getTalents(page, size) {
    try {
      const response = await axiosInstance.get(
        `v2/talents?page=${page}&size=${size}`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  async getTalent(id, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.get(`v2/talents/${id}`, {
        headers,
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async login(login, password) {
    const authString = `${login}:${password}`;
    const encodedAuthString = base64_encode(authString);
    const headers = {
      Authorization: `Basic ${encodedAuthString}`,
    };
    try {
      const response = await axiosInstance.post(
        `v2/talents/login`,
        {},
        { headers }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  async register(newUser) {
    try {
      const response = await axiosInstance.post(`v2/talents/register`, {
        ...newUser,
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  async getNewToken(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.post(
        "v2/talents/login",
        {},
        { headers }
      );
      console.log(response?.data?.token);
      return response?.data?.token;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async getAllProofs(page = 0, size = 5, orderBy = "asc") {
    try {
      const response = await axiosInstance.get(
        `v2/talents/proofs?page=${page}&size=${size}&order-by=${orderBy}`
      );

      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async getProofs(id, token, size = 5) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.get(
        `v2/talents/${id}/proofs?size=${size}&order-by=desc`,
        {
          headers,
        }
      );

      return response?.data.proofs;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async editTalent(id, editedUser, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.patch(
        `v2/talents/${id}`,
        editedUser,
        {
          headers,
        }
      );

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async editProof(id, idProof, editedProof, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.patch(
        `v2/talents/${id}/proofs/${idProof}`,
        editedProof,
        {
          headers,
        }
      );

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async deleteTalent(id, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.delete(`v2/talents/${id}`, {
      headers,
    });
    return response;
  },
  async addProof(proof, id, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.post(
        `v2/talents/${id}/proofs`,
        proof,
        {
          headers,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async deleteProof(id, idProof, token) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axiosInstance.delete(
        `v2/talents/${id}/proofs/${idProof}`,
        {
          headers,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async getKudos(id, token = undefined) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      let response = {};
      if (token) {
        response = await axiosInstance.get(
          `v3/talent/proofs/${id}/kudos`,

          {
            headers,
          }
        );
      } else {
        response = await axiosInstance.get(`v3/talent/proofs/${id}/kudos`);
      }

      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async putKudos(id, token) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axiosInstance.post(
        `v3/talent/proofs/${id}/kudos`,
        {},

        {
          headers,
        }
      );
      return response.data.amount;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async deleteKudos(id, token) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axiosInstance.delete(
        `v3/talent/proofs/${id}/kudos`,

        {
          headers,
        }
      );
      return response.data.amount;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
