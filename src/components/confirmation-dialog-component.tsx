import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

interface ConfirmationDialogComponentProps {
    show: boolean,
    handleOnClick: any
}

const ConfirmationDialogComponent = (props: ConfirmationDialogComponentProps) => {
    const footer =
        (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => props.handleOnClick(false)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={() => props.handleOnClick(true)} autoFocus />
            </div>
        )

    return (
        <div className="confirmation-dialog">
            <Dialog 
                header="Start a new deck" 
                visible={props.show} 
                modal 
                style={{ width: '450px' }} 
                footer={footer} 
                onHide={() => props.handleOnClick(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '5px'}} />
                    <span>Are you sure you want to start a new deck?</span>
                </div>
            </Dialog>
        </div>
    );
}

export default ConfirmationDialogComponent;