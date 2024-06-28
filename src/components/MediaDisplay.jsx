import Carousel from 'react-bootstrap/Carousel';

//Component to display the media in the status as a carousel
function MediaDisplay(props){
    return (
        <div className="statusMediaContainer">
            <Carousel controls={props.mediaList.length > 1} indicators={props.mediaList.length > 1} onClick={(e) => e.stopPropagation()}>
                {props.mediaList.map((media) => {
                    return(
                        <Carousel.Item>
                            {media.type === "gifv" || media.type === "video" ? 
                                <video controls preload="true" className="statusMedia">
                                    <source src={media.url} type="video/mp4"/>
                                </video>
                            :
                                <img className="statusMedia" src={media.url} alt="" />
                            }
                        </Carousel.Item>
                    )
                })}
            </Carousel>
        </div>
    );
}

export default MediaDisplay;