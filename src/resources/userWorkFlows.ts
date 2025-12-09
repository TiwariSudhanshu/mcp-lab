import { supabase } from "../supabase.js";

export async function getUserWorkflowState(userId: string){
    const {data, error} = await supabase
        .from("users")
        .select("id, email, status")
        .eq("id", userId)
        .single();
    if (error) {
        throw new Error(`Failed to fetch user workflow state: ${error.message}`);
    }
    return data;
}