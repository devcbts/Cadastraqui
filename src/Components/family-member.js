import './family-member.css'

export default function FamilyMember(props) {
  return(
    <div>
      <div>{props.name}</div>
      <div>{props.relationship}</div>
    </div>
  )  
}