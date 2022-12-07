import axios from 'axios';
import { HOST, API_VERSION } from '../../constants';
export const sendUnfriendRequest = async(friendIdx:number):Promise<boolean> =>{
    try{
        await axios.delete(`${HOST}/${API_VERSION}/friend/${friendIdx}`)
        alert('친구를 삭제했습니다')
        return true;
    }catch (err){
        console.log(err)
        return false;
    }
}