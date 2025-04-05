const setData =(data:any)=>{
    localStorage.setItem('data', JSON.stringify(data));
}
const getData =()=>{
    localStorage.getItem('data');

}
const removeData =()=>{
    localStorage.removeItem('data');
}

export {setData,getData,removeData}