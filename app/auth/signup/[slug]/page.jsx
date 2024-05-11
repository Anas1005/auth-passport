import React from 'react'
import axios from 'axios';


// export function generateStaticParams() {
//   console.log("Hello from Build...")
//   return [{ id: '1' }, { id: '2' }, { id: '3' }]
// }
 


const Slug = ({params}) => {
  // const response = await axios.get('https://studynotionbackend-00au.onrender.com/api/v1/course/getAllCategories');
  // const categories = response.data;
  // console.log(categories.allCategories);
  console.log(params)
  return (
<div>
{params.slug} {"jjdnajndjanjn"}
    </div>
  )
};


export default Slug