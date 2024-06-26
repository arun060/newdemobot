import React, { useState, useEffect } from 'react';
import { Toaster } from '@brainstormforce/starter-templates-components';
import Tooltip from '../../../onboarding-ai/components/tooltip';
import { __ } from '@wordpress/i18n';
import ICONS from '../../../../../icons';
import { useStateValue } from '../../../../store/store';
import { isSyncSuccess, SyncStart } from './utils';
import './style.scss';

const SyncLibrary = () => {
	const [ { currentIndex }, dispatch ] = useStateValue();

	const [ syncState, setSyncState ] = useState( {
		isLoading: false,
		updatedData: null,
		syncStatus: null,
	} );

	const { isLoading, updatedData, syncStatus } = syncState;

	useEffect( () => {
		if ( isLoading ) {
			window.onbeforeunload = () => {
				return true;
			};

			return () => {
				window.onbeforeunload = null;
			};
		}
	}, [ isLoading ] );

	if ( 0 === currentIndex ) {
		return null;
	}

	if ( syncStatus === true && !! updatedData ) {
		const { sites, categories, categoriesAndTags } = updatedData;

		if ( !! sites && !! categories && !! categoriesAndTags ) {
			dispatch( {
				type: 'set',
				allSitesData: sites,
				allCategories: categories,
				allCategoriesAndTags: categoriesAndTags,
			} );
		}
		setSyncState( {
			...syncState,
			updatedData: null,
		} );
	}

	const handleClick = async ( event ) => {
		event.stopPropagation();

		if ( isLoading ) {
			return;
		}

		setSyncState( { ...syncState, isLoading: true } );
		const newData = await SyncStart();
		setSyncState( {
			isLoading: false,
			updatedData: newData,
			syncStatus: isSyncSuccess(),
		} );
	};

	return (
		<>
			<div
				className={ `st-sync-library ${ isLoading ? 'loading' : '' }` }
				onClick={ handleClick }
			>
				<Tooltip content={ __( 'Sync Library', 'astra-sites' ) }>
					{ ICONS.sync }
				</Tooltip>
			</div>
			{ ! isLoading && syncStatus === true && (
				<Toaster
					type="success"
					message={ __(
						'Library refreshed successfully',
						'astra-sites'
					) }
					autoHideDuration={ 5 }
					bottomRight={ true }
				/>
			) }
			{ ! isLoading && syncStatus === false && (
				<Toaster
					type="error"
					message={ __( 'Library refreshed failed!', 'astra-sites' ) }
					autoHideDuration={ 5 }
					bottomRight={ true }
				/>
			) }
		</>
	);
};

export default SyncLibrary;
