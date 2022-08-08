import { useState, useEffect } from "react";

const Filters = (initialValue = []) => {
  const [currentContent, setCurrentContent] = useState(initialValue);

  useEffect(() => {
    setCurrentContent(initialValue);
  }, []);

  useEffect(() => {
    console.log("CurrentContent", currentContent);
  }, [currentContent]);

  const handleMultimediaFilter = (checkValue = true) => {
    if (currentContent.length === 0) return;
    if (!checkValue) {
      const filteredArray = initialValue.filter((post) => !!post.multimedia);
      setCurrentContent(filteredArray);
    } else {
      const filteredArray = initialValue.filter((post) => !post.multimedia);
      setCurrentContent(filteredArray);
    }
  };

  const handleDatePublishedFilter = (checkValue = true) => {
    if (currentContent.length === 0) return;
    const dummy = [...currentContent];
    if (!checkValue) {
      const sortedArray = dummy.sort((post, nextPost) => {
        const t1 = new Date(nextPost.createdAt);
        const t2 = new Date(post.createdAt);
        return t1 - t2;
      });
      setCurrentContent(sortedArray);
    } else {
      const sortedArray = dummy.sort((post, nextPost) => {
        const t1 = new Date(nextPost.createdAt);
        const t2 = new Date(post.createdAt);
        return t2 - t1;
      });
      setCurrentContent(sortedArray);
    }
  };

  const handleLikesFilter = (checkValue = true) => {
    if (currentContent.length === 0) return;
    const dummy = [...currentContent];
    if (!checkValue) {
      const sortedArray = dummy.sort((post, nextPost) => {
        return post.likes.length - nextPost.likes.length;
      });
      setCurrentContent(sortedArray);
    } else {
      const sortedArray = dummy.sort((post, nextPost) => {
        return nextPost.likes.length - post.likes.length;
      });
      setCurrentContent(sortedArray);
    }
  };

  const handleCommentsFilter = (checkValue = true) => {
    if (currentContent.length === 0) return;
    const dummy = [...currentContent];
    if (!checkValue) {
      const sortedArray = dummy.sort((post, nextPost) => {
        return post.commentsId.length - nextPost.commentsId.length;
      });
      setCurrentContent(sortedArray);
    } else {
      const sortedArray = dummy.sort((post, nextPost) => {
        return nextPost.commentsId.length - post.commentsId.length;
      });
      setCurrentContent(sortedArray);
    }
  };

  return {
    currentContent,
    restoreContent: () => setCurrentContent(initialValue),
    setCurrentContent,
    handleMultimediaFilter,
    handleDatePublishedFilter,
    handleLikesFilter,
    handleCommentsFilter,
  };
};

export default Filters;
