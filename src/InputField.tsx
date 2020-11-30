import React from 'react'

class InputField extends React.Component<{
    type: string, autoComplete: string, placeholder: string, value: string, onChange: (value: string) => void
}, {}> {
    render() {
        return (
            <div className="InputField">
                <input
                    className='Input'
                    type={ this.props.type }
                    autoComplete={ this.props.autoComplete }
                    placeholder={ this.props.placeholder }
                    value={ this.props.value }
                    onChange={ (e) => this.props.onChange(e.target.value) }
                />
            </div>
        )
    }
}

export default InputField