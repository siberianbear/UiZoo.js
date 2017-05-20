import React from 'react';
import _ from 'underscore';
import jsxToString from 'jsx-to-string';
import {Card, CardText} from 'material-ui';
import {previewFrameStyle} from './previewFrameStyle';
import Separator from '../Separator';
import CodeCard from '../CodeCard';
import ComponentParams from '../ComponentParams';
import ComponentExamples from '../ComponentExamples';
import './index.scss';

/**
 * @description
 * Review the current component
 * Choose props, example of see the source code
 */
export default class ComponentReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentParams: {}
        };
        this.updateParam = this.updateParam.bind(this);
        this.updateExample = this.updateExample.bind(this);
    }

    /**
     * Update when one of the params has changed
     * @param {event} e
     * @param {string} paramName
     * @param {any} value
     */
    updateParam(e, paramName, value) {
        let componentParams = _.extend({}, this.state.componentParams, {[paramName]: value});
        // clean undefined values
        _.keys(componentParams).forEach(key => typeof componentParams[key] === 'undefined' && delete componentParams[key]);
        this.setState({componentParams});
    }

    /**
     * Update the params by the example
     * @param {string} example
     */
    updateExample(example) {
        console.log(example); // TODO: parse example to JSX and load to view
    }

    /**
     * Metadata - title, description, etc.
     * @param {object}
     */
    renderComponentMetadata({name, description, section = ''}) {
        const sectionParts = section.split("/"); // TODO: Support "windows" paths
        return (
            <div>
                <p className="component-section">{sectionParts.join(" > ")}</p>
                <h1 className="component-name">
                    {!!name && name}
                    {!name && 'Welcome to Bibliotheca!'}
                </h1>
                <h3 className="component-description">
                    {description}
                    {!name && 'please select a component to view'}
                </h3>
            </div>
        );
    }

    /**
     * Content - the actual rendered component on review
     * @param {object}
     */
    renderComponentContent(componentContent) {
        return (
            <Card className="component-content" style={previewFrameStyle}>
                <CardText>
                    {componentContent}
                </CardText>
            </Card>
        );
    }

    /**
     * Possible params of the component on review
     * @param {object}
     */
    renderComponentParams({params = []}) {
        return (
            <div className="component-params-section">
                <p className="section-header">Params:</p>
                <ComponentParams params={params} onChange={this.updateParam}/>
            </div>
        );
    }

    /**
     * Possible examples of the component on review
     * @param {object}
     */
    renderComponentExamples({examples = []}) {
        return (
            <div className="component-examples-section">
                <p className="section-header">Examples:</p>
                <ComponentExamples examples={examples} onChange={this.updateExample}/>
            </div>
        );
    }

    /**
     * Source code of the component on review with chosen props
     * @param {object}
     */
    renderComponentSourceCode(componentContent) {
        const componentSourceCode = !!componentContent ? jsxToString(componentContent) : null;
        return (
            <div className="component-source-code">
                <p className="section-header">Source code:</p>
                <CodeCard>
                    {componentSourceCode}
                </CodeCard>
            </div>
        );
    }

    /**
     * Render the component by the provided documentation
     */
    render() {
        const componentDoc = this.props.documentation || {};
        // TODO: window namespace should be declared in server
        const ComponentNode = componentDoc.name
            ? window.libraryData[componentDoc.name]
            : null;
        const componentContent = componentDoc.name
            ? <ComponentNode {...this.state.componentParams}/>
            : null;

        return (
            <div className="component-review">
                {this.renderComponentMetadata(componentDoc)}
                <Separator/> {this.renderComponentContent(componentContent)}
                <Separator/> {this.renderComponentParams(componentDoc)}
                <Separator/> {this.renderComponentExamples(componentDoc)}
                <Separator/> {this.renderComponentSourceCode(componentContent)}
            </div>
        );
    }
}