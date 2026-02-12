import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name : "request",
    initialState : {
        request  : []
    },
    reducers : {
        addToRequest : (state,action)=>{
            state.request = action.payload;
        },

        removeFromRequest : (state,action)=>{
            state.request = state.request.filter((user)=> user.fromUserId?._id !== action.payload )
        } 
    }
})

export default requestSlice.reducer;

export const {addToRequest , removeFromRequest} = requestSlice.actions;