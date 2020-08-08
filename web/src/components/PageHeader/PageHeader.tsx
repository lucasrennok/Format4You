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
                <input type="text"></input>
                : 
                <h1 className="title">Format 4 You</h1>
            }
        </div>
    );
}

export default PageHeader;