import React from "react"
import { StaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Article from "../components/article"

const IndexPage = () => (
  <Layout>
    <StaticQuery
      query={graphql`
        {
          allContentfulArticle {
            edges {
              node {
                id
                title
                text {
                  text
                }
                banner {
                  file {
                    url
                  }
                }
                publishedAt
              }
            }
          }
        }
      `}
      render={({
        allContentfulArticle: {
          edges
        }
      }) => (
        edges.map(({ node }) => (
          <Article key={node.id} content={node} />
        ))
      )}
    />
  </Layout>
)

export default IndexPage

// const IndexPage = () => (
//   <Layout>
//     <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
//     <h1>Hi people</h1>
//     <p>Welcome to your new Gatsby site.</p>
//     <p>Now go build something great.</p>
//     <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
//       <Image />
//     </div>
//     <Link to="/page-2/">Go to page 2</Link>
//   </Layout>
// )