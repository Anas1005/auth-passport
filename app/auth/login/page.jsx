import React from 'react'
import axios from 'axios';

const Slug = async() => {
  const response = await axios.get('https://studynotionbackend-00au.onrender.com/api/v1/course/getAllCategories');
  const categories = response.data;
  console.log(categories.allCategories);
  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.allCategories.map(category => (
          <>
          <li key={category._id}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </li>
          <br/>
          </>
        ))}
      </ul>
    </div>
  );
};

export default Slug;