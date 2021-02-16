import React from 'react';
import { KeystoneProvider } from '../../context';
import { ErrorBoundary } from '../../components';
import { Core } from '@keystone-ui/core';
import { AppProps } from 'next/app';
import { DocumentNode } from 'graphql';
import { AdminConfig, FieldViews } from '@keystone-next/types';

type AppConfig = {
  adminConfig: AdminConfig;
  adminMetaHash: string;
  fieldViews: FieldViews;
  lazyMetadataQuery: DocumentNode;
};

export const getApp = (props: AppConfig) => ({ Component, pageProps }: AppProps) => {
  return (
    <Core>
      <KeystoneProvider {...props}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </KeystoneProvider>
    </Core>
  );
};
