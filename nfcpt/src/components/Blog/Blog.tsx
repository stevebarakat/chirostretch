"use client";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Posts } from "../Posts";

const postsPerPage = 6;

function Blog({ posts }: { posts: ExcerptType[] }) {
  const [postOffset, setPostOffset] = useState(0);

  const endOffset = postOffset + postsPerPage;
  const currentPosts = posts.slice(postOffset, endOffset);
  const pageCount = Math.ceil(posts.length / postsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * postsPerPage) % posts.length;
    setPostOffset(newOffset);
  };

  const hasNextPage = posts.length > postOffset + postsPerPage;
  const hasPreviousPage = postOffset > 0;
  return (
    <>
      <Posts posts={currentPosts} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="&raquo;"
        nextClassName={
          hasNextPage ? "pagination-item" : "pagination-item disabled"
        }
        nextLinkClassName="pagination-link"
        previousLabel="&laquo;"
        previousClassName={
          hasPreviousPage ? "pagination-item" : "pagination-item disabled"
        }
        previousLinkClassName="pagination-link"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        containerClassName="pagination"
        pageClassName="pagination-item"
        pageLinkClassName="pagination-link"
        activeClassName="active"
      />
    </>
  );
}

export default Blog;
