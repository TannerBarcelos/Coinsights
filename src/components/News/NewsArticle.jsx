import { convertISOString } from '../../common/utils/formatters/dateConversion'

function NewsArticle({ article }) {
  const {
    title,
    url,
    published_date,
    publisher: { name },
  } = article
  return (
    <a href={url} target='_blank' rel='noreferrer'>
      <div className='news-card'>
        <small>{name}</small>
        <p>{title}</p>
        <span>{convertISOString(published_date)}</span>
      </div>
    </a>
  )
}

export default NewsArticle
