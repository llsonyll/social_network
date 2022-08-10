import { Types } from "mongoose"

export const getIndex = (array: any, id: string):number => {
    if(array[0]._id.toString() !== id){
        return 0
    }else{
        return 1
    }
}