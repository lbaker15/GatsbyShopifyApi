import React from 'react';
import './text.css';

class Text extends React.Component {
    state = {title: ''}
    componentDidMount() {
        const {item, animate} = this.props;
        this.setState({
            title: item.title
        })
    }
    componentDidUpdate() {
        const {item, animate} = this.props;
        const {title} = this.state;
        if (title !== item.title) {
            new Promise((res, rej) => {
                res(this.setState({
                    title: item.title,
                    animation: true
                }))
            }).then(() => {
                setTimeout(() => {
                this.setState({
                    animation: false
                })
                }, 500)
            })
        }
    }
    render() {
        const {item, animate} = this.props;
        const {animation} = this.state;
        return (
            <React.Fragment>
                <h1 id={animation ? 'fadeIn' : null} className="title">{item.title}</h1>
            </React.Fragment>
        )
    }
}

export default Text;