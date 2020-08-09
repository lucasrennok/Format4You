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
                        <input type="text" maxLength={15} defaultValue="newDocument" />
                        <p>.docx</p>
                    </div>
                </div>
                :
                <div className="title-box">
                    <h1 className="title-header">Format 4 You</h1>
                    <p>You write we format</p>
                </div>
            }
        </div>
    );
}

export default PageHeader;