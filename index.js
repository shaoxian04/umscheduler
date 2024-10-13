const monday=document.querySelectorAll(".Monday");
const tuesday=document.querySelectorAll(".Tuesday");
const wednesday=document.querySelectorAll(".Wednesday");
const thursday=document.querySelectorAll(".Thursday");
const friday=document.querySelectorAll(".Friday");
const input=document.getElementById("inputFile");
const submit=document.getElementById("submit");

function readCSV(){
    const file=input.files[0];
    
    if(file){
        Papa.parse(file,{
            beforeFirstChunk:chunk=>{
                const lines=chunk.split('\n');
                //const temp=lines[2].split(`"`);
                //const num=temp[1].split(",").length;
                const remainingLines=lines.slice(3).join('\n');
                return remainingLines;
            },
            header:true,
            skipEmptyLines:true,
            complete:results=>{
                generate(results.data);
            }
        });
    }
    else{
        window.alert("Please upload a CSV file")
    }
}
function generate(data){
    const{"Begin date":beginDate}=data[0];
    let index=calculateSubject(beginDate,data);
    const cleanData=data.slice(0,index);
    console.log(cleanData);
    const w=105;
    for(let item of cleanData){
        const{"Begin date":date,"Begin time":begin,"End time":end,"Module":module,"Room ":venue,"Activity":activity}=item;
        let duration=getDuration(begin,end);
        let day=getDay(date);
        let index=begin.split(":")[0]-8;
        const list=document.querySelectorAll(`.${day}`);
        const row=document.getElementById(`${day}row`);
        row.style.height="120px";
        const container=document.createElement("div");
        activity==="TUTORIAL"?container.classList.add("tutorial"):container.classList.add("lecture");
        container.style.width=`${duration*w}px`;
        container.innerHTML=`
            <span style="font-size: 16px;">${module}</span>
            <span style="font-size: 10px;">${activity}</span>
            <span style="font-size: 12px;">${venue}</span>
        `;
        container.style.whiteSpace="pre-line";
        list[index].appendChild(container);
    }
    

}

function calculateSubject(dateString,data){
    const dateArr=dateString.split("/");
    let beginDate=new Date(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);
    beginDate.setDate(beginDate.getDate()+7);
    const endDate=beginDate.toISOString();
    const endArr=endDate.split("T")[0].split("-");
    const endString=`${endArr[2]}/${endArr[1]}/${endArr[0]}`;
    let count=0;
    for(let d of data){
        const{"Begin date":b}=d;
        if(b===endString){
            break;
        }
        count++;
    }
    return count;
}
function getDay(dateString){
    const arr=dateString.split("/");
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const date=new Date(`${arr[2]}-${arr[1]}-${arr[0]}`);
    return days[date.getDay()];
}
function getDuration(begin,end){
    btime=begin.split(":")[0];
    etime=end.split(":")[0];
    return etime-btime;
}
async function generateImage(){
    const timetable=document.getElementById("timetable");
    const capture=await html2canvas(timetable);
    const img=capture.toDataURL('image/png');
    const link=document.createElement('a');
    link.href=img;
    link.download='timetable.png';
    link.click();
}
