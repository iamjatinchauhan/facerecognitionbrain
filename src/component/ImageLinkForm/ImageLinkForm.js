import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return(
        <div>
            <p className='f3'>
                {'Face Recognition Brain detects faces in pictures. Give it a Go!'}
            </p>
            <div className='center'>
                <div className='form center pa2 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} />
                    <button 
                    className='w-30 grow f4 link ph3 pv2 dib black bg-light-red'
                    onClick={onButtonSubmit}
                    >DETECT</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;