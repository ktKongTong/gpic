import ReactMarkdown from 'react-markdown';
export default function Markdown({
  content
}:{
  content: string | null | undefined
}) {

  return <div className={'prose prose-blue prose-invert prose-a:text-white  text-white'}>
    <ReactMarkdown

    >{content}</ReactMarkdown>
  </div>
}