const MultimediaElement = ({ source }) => {
  if (!source) return null;
  return <img className="my-3" src={source} alt="multimediaElement" />;
};

export default MultimediaElement;
