import React from "react"

const Article = ({ content }) => (
  <div>
    <h2>{content && content.title}</h2>
    <img src={content && content.banner && content.banner.file && content.banner.file.url} alt={content && content.title}/>
    <p>
      {content && content.text && content.text.text}
    </p>
    <h5>{content && content.publishedAt}</h5>
  </div>
)

export default Article
