import React from 'react';
import pageIcon from '../../assets/images/icons/leaf.png'

import './styles.css'

interface PageHeaderProps{
    inputBoolean: boolean;
}

const PageHeader: React.FC<PageHeaderProps>= (pageHeaderProps) => {    
    return (
        <div className="page-header">
            <img src={pageIcon} alt="leaf" className="pageIcon"/>
            {pageHeaderProps.inputBoolean
                ? 
                <div className="inputTitle">
                    <label>Document title</label>
                    <div className="inputBox">
                        <input type="text" value="newDocument"></input>
                        <p>.docx</p>
                    </div>
                </div>
                :
                <h1 className="title-header">Format 4 You</h1>
            }
        </div>
    );
}
//let us format for you | you write we format

export default PageHeader;