import {Link} from 'react-router-dom'
import './index.css'

const UserDetails = props => {
  const {userList} = props
  const {name,email, dob} = userList
  const age=new Date().getFullYear()-new Date(dob).getFullYear()
  return (
      <div>
       <li className="list-item">
           <p className="name">{name}</p>
           <p className="email">{email}</p>
           <p className="age">{age}</p>
           <hr className='line'/>
       </li>
       <Link to="/login"><button>Create</button></Link>
      </div>
  )
}

export default UserDetails