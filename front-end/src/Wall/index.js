import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import './Wall.css';
import Modal from '../Modal'
import Form from '../Form'
import { sendXhrRequest } from '../Utils';

class Wall extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          images: [],
          modalDisplay: "none",
          imageTitle: "",
          imageUrl: ""
        };
        
        this.deleteImage = this.deleteImage.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    showModal() {
        this.setState({
            modalDisplay: "block"
        })
    }
    
    closeModal() {
        this.setState({
            modalDisplay: "none"
        })
    }
    
    submitForm(e) {
        e.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/images');
        xhr.setRequestHeader('x-auth-token', this.props.token);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status < 400) {
                this.componentDidMount();
            }
        }
        xhr.send("title=" + this.state.imageTitle + "&url=" + this.state.imageUrl);
    }
    
    deleteImage(e) {
        e.preventDefault();
        // alert(e.target.dataset.memeid);
        
        const updateComponent = () => {
            this.componentDidMount();
        }
        
        sendXhrRequest('DELETE', '/api/images/' + e.target.dataset.memeid, this.props.token, updateComponent);
    }
    
    componentDidMount() {
        let url = this.props.userWall ? "/api/images/users" : "/api/images";
        
        const updateComponent = (xhr) => {
            let dataObj = JSON.parse(xhr.response);
            this.setState({
                images: dataObj.data,
                modalDisplay: "none",
                imageTitle: "",
                imageUrl: ""
            })
        }

        sendXhrRequest('GET', url, this.props.token, updateComponent);        
    }
    
    render () {

        return (
            <div className='mtop-1'>
                {this.props.token ?
                    <button type='button' className='add-button' onClick={this.showModal}><i className="fas fa-plus"></i> Add</button> : null
                }
                <Masonry
                    className='grid'
                    disableImagesLoaded={false}
                    updateOnEachImageLoad={false}
                >
                    {this.state.images.map((image) => {
                      return <div key={image.id} className='grid-item'>
                                <div className='meme-container'>
                                    <div className='meme-title'>
                                        <p>{image.title}</p> 
                                    </div>
                                    <div className='meme-image'>
                                        <img src={image.url} alt='meme'/>
                                    </div>
                                    {this.props.userWall ?
                                    <div className='meme-footer'>
                                        <button type='button' className='footer-button' data-memeid={image.id} onClick={this.deleteImage}>Delete</button>
                                    </div> : null
                                    }
                                </div>
                            </div>; 
                    })}
                </Masonry>
                {this.props.token ? 
                    <Modal modalStyle={{display: this.state.modalDisplay}} closeClickHandler={this.closeModal} header='Add a new meme'> 
                        <Form submitHandler={this.submitForm}>
                            <div className='input-group'>
                                <label>Meme Title</label>
                                <input type='text' placeholder='Give your meme a name' name='imageTitle' value={this.state.imageTitle} onChange={this.handleChange} required />
                            </div>
                            <div className='input-group'>
                                <label>Meme URL</label>
                                <input type='url' placeholder='Enter the url for  your meme' name='imageUrl' value={this.state.imageUrl} onChange={this.handleChange} required />
                            </div>
                            <button type='submit'>Save</button>
                        </Form>
                    </Modal>
                    : null }
            </div>
        )
    }
}

export default Wall;