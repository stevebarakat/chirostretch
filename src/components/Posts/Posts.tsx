import { Excerpt } from "../Excerpt";

type Props = {
  posts: ExcerptType[];
};

function Posts({ posts }: Props) {
  return (
    <div className="posts">
      {posts?.map((post) => {
        return <Excerpt key={post.uri} post={post} />;
      })}
    </div>
  );
}

export default Posts;
