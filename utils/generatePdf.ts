import jsPDF from "jspdf";
import "jspdf-autotable";
interface DataInterface{

head:any,
body:any
file:String

}

export default (input:DataInterface)=>{

const {body,head,file} = input

const doc = new jsPDF();
doc.autoTable({
head:head,
body:body

})
doc.save(file);


}