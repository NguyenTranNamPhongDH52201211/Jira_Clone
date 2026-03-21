import api from "./axios";


export const sprintApi ={
    getProjectSprints: async(projectId: number)=>{
        const response = await api.get(`/projects/${projectId}/sprints`);
        return response.data;
    },

    startSprint: async(sprintId: number)=>{
        const response= await api.patch(`/sprints/${sprintId}/start`);
        return response.data;
    },

    completeSprint:async(sprintId: number)=>{
        const response =await api.patch(`/sprints/${sprintId}/complete`);
        return response.data;
    }
}