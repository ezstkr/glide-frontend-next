import React from 'react';
import { MetaData } from '../../shared/types/react-chat-bot';

interface Props {
  mainData: {
    type: string;
    urlText?: string | undefined;
    metaDataList?: MetaData[];
  };
}

const UrlPreview: React.FC<Props> = ({ mainData }) => {
  // const urls = mainData.urls;
  // const [metaDataList, setMetaDataList] = useState<Array<MetaData>>(
  //   Array(urls?.length).fill({ 
  //     url: '',
  //     title: '', 
  //     description: '', 
  //     image: ''
  //   })
  // )
  
  // const getMetadataAll = async () => {
  //   urls?.map(async (url, index) => {
  //     const metaData = await getMetadata(url);
  //     setMetaDataList((prev: any) => {
  //       prev[index] = metaData
  //       return prev;
  //     });
  //   })
  // }

  // const getMetadata = async (url: string) => {
  //   // Fetch the HTML from the URL
  //   const response = await fetch(url);
  //   const html = await response.text();
  
  //   // Parse the HTML into a document
  //   const doc = new DOMParser().parseFromString(html, 'text/html');
  
  //   // Extract the metadata
  //   const metadata = {
  //     url: url,
  //     title: doc.querySelector('title')?.innerText ?? '',
  //     description: doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
  //     image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
  //     // ...extract other metadata as needed...
  //   };
  
  //   return metadata;
  // }

  // useEffect(() => {
  //   getMetadataAll()
  // })

  return (
    <div className="qkb-msg-bubble-component qkb-msg-bubble-component--urls">
      {mainData.metaDataList?.map((metaData: MetaData, index: number) => (
        <div className="qkb-msg-bubble-component__url" key={index}>
          <div className="qkb-msg-bubble-component__url__top">
            <div className="qkb-msg-bubble-component__url__image">
              <img src={metaData.image} alt={metaData.title} />
            </div>
            <div className="qkb-msg-bubble-component__url__title">
              {metaData.title}
            </div>
            <div className="qkb-msg-bubble-component__url__description">
              {metaData.description}
            </div>
          </div>

          <a 
            className="qkb-msg-bubble-component__url__bottom" 
            href={metaData.url} 
            target='_blank'
          >
            {mainData.urlText}
          </a>
        </div>
      ))}
    </div>
  );
};

export default UrlPreview;
