import Link from './Link'
import siteMetadata from '../data/siteMetadata'
import SocialIcon from './social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-14 flex flex-col items-center">
        <div className="mb-3 flex space-x-2  ">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-white dark:text-white ">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div className='hover:text-blue-600'><Link href="/">{siteMetadata.title}</Link></div>
        </div>
        
      </div>
    </footer>
  )
}
