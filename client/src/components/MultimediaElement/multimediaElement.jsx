const MultimediaElement = ({ source }) => {
  if (!source) return null;
  return <img className="my-3 w-4/5  mx-auto" src={source} alt="multimediaElement" />;
};

export default MultimediaElement;
